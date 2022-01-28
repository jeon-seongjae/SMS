import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { HttpService } from '@nestjs/axios';
import { CreateSmsDto } from './dto/sms.dto';

import * as crypto from 'crypto';
import axios from 'axios';

const secretKey: string = `${process.env.SECRET_KEY}`;
const accessKey: string = `${process.env.ACCESS_KEY}`;
const phoneNumber: string = `${process.env.PHONE_NUMBER}`;
const serviceId: string = `${process.env.SERVICE_ID}`;
const timestamp = Date.now().toString();

@Injectable()
export class UsersService {
  makeSignature = (): string => {
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(`POST /sms/v2/services/${serviceId}/messages\n`)
      .update(`${timestamp}\n`)
      .update(`${accessKey}`);

    return hmac.digest('base64').toString();
  };

  makeRanNum = (): number => {
    const randNum = Math.floor(Math.random() * 1000000);
    return randNum;
  };

  async sendSms(userPhoneNumber: string) {
    const checkNumber: string = this.makeRanNum().toString().substring(4, 0);
    const doneSignature: string = this.makeSignature();

    const body: CreateSmsDto = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: phoneNumber,
      content: `JEON의 인증번호는 [${checkNumber}] 입니다.`,
      messages: [
        {
          to: userPhoneNumber,
        },
      ],
    };

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': accessKey,
      'x-ncp-apigw-signature-v2': doneSignature,
    };

    const url: string = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`;

    await axios
      .post(url, body, { headers })
      .then((res) => {
        console.log('succeed');
      })
      .catch((e) => {
        console.log(e.response.data, 'err');
        console.log(headers, body, url, timestamp);
        throw new BadRequestException('문자요청이 실패했습니다.');
      });

    return { message: 'succeed', checkNum: checkNumber };
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
