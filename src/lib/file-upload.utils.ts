/* eslint-disable @typescript-eslint/no-var-requires */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { fromBuffer } from 'file-type';
import axios from 'axios';
const fs = require('fs');
const dayjs = require('dayjs');

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const splits = file.originalname.split('.');
  splits.pop();
  const name = splits.join('_');
  const folderName = dayjs().format('YYYYMMDD');

  const dir = `./files/${folderName}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

  callback(null, `${folderName}/${name}-${randomName}${fileExtName}`);
};

export const multerOption = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  storage: diskStorage({
    destination: `./files`,
    filename: editFileName,
  }),
};

export const getFileExt = async (url: string) => {
  try {
    if (url) {
      const response = await axios(url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const file = await fromBuffer(buffer);
      return file?.ext || '';
    }
  } catch (e) {
    console.log(e);
  }
};

export const mappingFileExt = async (queryResult: any, keys = []) => {
  if (queryResult && keys?.length > 0) {
    if (Array.isArray(queryResult)) {
      return Promise.all(
        queryResult.map(async (res) => {
          return Promise.all(
            keys.map(async (key) => ({
              ...res,
              [`${key}Ext`]: await getFileExt(res[key]),
            })),
          );
        }),
      );
    }
  } else {
    return keys.map((key) => ({
      ...queryResult,
      [`${key}Ext`]: getFileExt(queryResult[key]),
    }));
  }
  return queryResult;
};
