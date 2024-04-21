FROM golang:1.22-alpine3.18 as base
RUN apk update 
WORKDIR /src/todo_list-backend
COPY go.mod go.sum ./
COPY . . 
RUN go build -o todo ./main.go

FROM alpine:3.18 as binary
COPY --from=base /src/todo_list-backend .
EXPOSE 3000
CMD ["./todo"]