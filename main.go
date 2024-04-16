package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/levy-oliveira/todo_list/routes"
	"github.com/levy-oliveira/todo_list/database"
)

func main() {
	database.Connect()
	app := fiber.New()

	// Middleware CORS
    app.Use(func(c *fiber.Ctx) error {
        c.Set("Access-Control-Allow-Origin", "*") // Permitir solicitações de qualquer origem
        c.Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS") // Métodos HTTP permitidos
        c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // Headers permitidos
        if c.Method() == "OPTIONS" {
            // Responder imediatamente para solicitações OPTIONS
            return c.SendStatus(fiber.StatusNoContent)
        }
        // Avance para o próximo middleware
        return c.Next()
    })
	routes.Setup(app)
	app.Listen(":3000")
}