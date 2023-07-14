import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import File from './entities/file.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class FilesService {
  private readonly s3 = new S3();
  constructor(
    @InjectRepository(File)
    private publicFilesRepository: Repository<File>,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<File> {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.AWS_BUCKET,
        Body: dataBuffer,
        Key: `${randomUUID()}-${filename}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOne({
      where: { id: fileId },
    });
    await this.s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: file.key,
      })
      .promise();
    await this.publicFilesRepository.delete(fileId);
  }
}
