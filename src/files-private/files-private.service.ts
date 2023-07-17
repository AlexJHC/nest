import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PrivateFile from './entities/private-files.entity';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesPrivateService {
  constructor(
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
  ) {}

  async uploadPrivateFile(
    dataBuffer: Buffer,
    ownerId: number,
    filename: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_PRIVATE,
        Body: dataBuffer,
        Key: `${randomUUID()}-${filename}`,
      })
      .promise();

    const newFile = this.privateFilesRepository.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });
    await this.privateFilesRepository.save(newFile);
    return newFile;
  }

  public async getPrivateFile(fileId: number) {
    const s3 = new S3();

    const fileInfo = await this.privateFilesRepository.findOneOrFail({
      where: { id: fileId },
      relations: ['owner'],
    });

    const stream = await s3
      .getObject({
        Bucket: process.env.AWS_BUCKET_PRIVATE,
        Key: fileInfo.key,
      })
      .createReadStream();
    return {
      stream,
      info: fileInfo,
    };
  }

  public async generatePresignedUrl(key: string) {
    const s3 = new S3();

    return s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_BUCKET_PRIVATE,
      Key: key,
    });
  }
}
