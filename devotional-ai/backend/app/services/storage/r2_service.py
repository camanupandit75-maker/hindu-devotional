import boto3
from botocore.client import Config
from pathlib import Path
from datetime import datetime
from ...core.config import settings
import mimetypes


class R2StorageService:
    
    def __init__(self):
        self.client = boto3.client(
            's3',
            endpoint_url=f'https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            config=Config(signature_version='s3v4'),
            region_name='auto'
        )
        self.bucket = settings.R2_BUCKET_NAME
        self.public_url = settings.R2_PUBLIC_URL
    
    def upload_file(
        self,
        file_path: str,
        object_key: str = None,
        content_type: str = None
    ) -> str:
        if object_key is None:
            timestamp = datetime.now().strftime("%Y/%m/%d")
            filename = Path(file_path).name
            object_key = f"{timestamp}/{filename}"
        
        if content_type is None:
            content_type, _ = mimetypes.guess_type(file_path)
            if content_type is None:
                content_type = 'application/octet-stream'
        
        self.client.upload_file(
            file_path,
            self.bucket,
            object_key,
            ExtraArgs={
                'ContentType': content_type,
                'CacheControl': 'public, max-age=31536000'
            }
        )
        
        return f"{self.public_url}/{object_key}"
    
    def delete_file(self, object_key: str):
        self.client.delete_object(Bucket=self.bucket, Key=object_key)


r2_storage = R2StorageService()

