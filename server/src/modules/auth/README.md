# Xử lý phân quyền bằng jwt

### Luồng xử lý

- Request sẽ trãi qua các guard:
  - `Auth Guard`:
    - server lấy token trong trường `authorization` trong request header
    - giải mã, tìm ra id và username trong token
    - tìm kiếm user trong db với id, sau đó so sánh username đã giải mã và username trong database
    - [Ok]: gán vào request trường user {id, username, role}
    - [NotFit]: return Exception()
  - `Role Guard`:
    - server lấy trường `user` vừa được gán sau khi xử lý ở `Auth Guard`
    - so sánh với các phần tử trong mảng `@hasRoles(...)`
    - [Ok]: Có một phân tử phù hợp thì được truy cập sử dụng service
    - [NotFit]: return Exception()

### Import ở các module khác

- Do ở AuthModule có sử dụng UserService nên cần import vào `providers`
- Đồng thời thêm entitys `User` để truy xuất database

```ts
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, OtherEntity])],
  controllers: [OtherController],
  providers: [UserService, OtherService],
})
```

## Sử dụng ở controller

- Khai báo các `guard` được sử dụng trong `@UseGuard(...)`
- Thêm các quyền vào `@hasRoles(...)` để xác định quyền truy cập

```ts
@UseGuard(JwtAuthGuard, RolesGuard)
@hasRoles(Role.MODERATOR, Role.ADMIN)
@Get('user/:id')
async getAllPostsOfUserId(@Param('id', ParseIntPipe) id: number) {
  return this.postService.getAllPostsOfUserId(id);
}
```

- Lưu ý: phải thêm `token` vào trường `authorization` để truy cập
