# Khởi tạo nhanh 1 cấu trúc module  🚀🚀🚀 
- bước 1: tạo thư mục ứng với tên model mà bạn muốn tạo và copy các thư mục, file trong thư mục example 
- bước 2: vào trong thư mục constants thay đổi các thông số theo đúng với model
- bước 3: vào trong file index.ts trong thư mục modules để update thêm model bạn mới tạo 
- bước 4: khởi động server lên và cảm nhận. chúc mừng bạn đã khởi tạo thành công API với các chức năng CURD cơ bản 
<h1 align="center">  🎊🎊🎉🎉🎉🎊🎊 </h1>

# Cấu trúc thư mục example 🌳🌳🌳

- `constants` : chứa các biến tag, endpoint, path, ... để cấu hình cho route API của bạn.
-  `dto` : chứa các Data transfer object của API.
- `schema` : chứa các cấu trúc database mà bạn muốn tạo, mặc định hệ thống đang xài database là Mongodb.
- `model.controller.ts` : nơi viết các controller xử lý request từ phía frontend.
- `model.service.ts` : nơi viết các service để cung cấp cho controller gọi.
- `model.module.ts` : nơi khai báo sử dụng các class hoặc interfaces.
- `*.spec.ts` : các file viết test case.

### @Prop()

- Trong @Prop() gồm có các thuộc tính:

  - `type`: kiểu dữ liệu của trường.
  - `required`: xác định xem trường có bắt buộc hay không.
  - `default`: giá trị mặc định của trường.
  - `unique`: xác định xem giá trị của trường có duy nhất hay không.
  - `index`: xác định xem trường có được lập chỉ mục hay không.

```ts
@Prop({
  type: String,
  unique: true,
  required: true,
})
email: string;

@Prop({
  type: String,
  required: true,
})
password: string;
```

### Document

```ts
export type BaseDocument = Document & BaseSchema;
```

- Dùng để tạo ra một kiểu dữ liệu mới cho các document. Kiểu dữ liệu này kế thừa từ kiểu dữ liệu “Document” của Mongoose và thêm các thuộc tính của schema của bạn vào đó.

## @Injectable()

- Dùng để đánh dấu một class là một provider. Các tham số của @Injectable() bao gồm:

  - `scope`: xác định phạm vi của provider. Giá trị mặc định là `Scope.DEFAULT`.
  - `forwardRef`: xác định xem liệu provider có phải là một forward reference hay không.
  - `useClass`: xác định class được sử dụng để tạo ra instance của provider.
  - `useValue`: xác định giá trị được sử dụng để tạo ra instance của provider.
  - `useFactory`: xác định factory function được sử dụng để tạo ra instance của provider.
  - `inject`: xác định các dependency được inject vào provider.
