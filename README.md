## Node version: 19

```
npm install
npm run start:dev
```

## Swagger

```
username: admin
password: admin
```

## API

### 1. Get news

```
Endpoint: news/search
Method: POST
Request body:
{
  skip: number,
  limit: number
}

Response:
{
  data: {
    docs: [
      {
        id: string
        _id: string
        original_id: string
        original_url: string
        title: string
        author: string
        avatar: string
        avatar_desc: string
        sapo: string
        content: string
        scraped_time: string
      },
      ...
    ],
    total: number
  }
}
```

### 2. Get news by id

```
Endpoint: news/:id

Method: GET

Request params:
id: id của news lấy từ danh sách


Response:
{
  data: {
    id: string
    _id: string
    original_id: string
    original_url: string
    title: string
    author: string
    avatar: string
    avatar_desc: string
    sapo: string
    content: string
    scraped_time: string
  }
}
```
