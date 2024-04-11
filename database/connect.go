package database

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"github.com/levy-oliveira/todo_list/models"
)

func Connect() {
	var dsn = "root:123454321@/todo_list?charset=utf8mb4&parseTime=True&loc=Local"
	var v = "Não conseguiu conectar ao banco de dados"
	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(v)
	}
	conn.AutoMigrate(&models.User{})
    fmt.Println("conexão OK!")
}