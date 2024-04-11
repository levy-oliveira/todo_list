package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/levy-oliveira/todo_list/routes"
	"github.com/levy-oliveira/todo_list/database"
)

func main() {
	database.Connect()
	app := fiber.New()
	routes.Setup(app)
	app.Listen(":3000")
}