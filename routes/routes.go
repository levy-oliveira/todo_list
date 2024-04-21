package routes

import (
	"github.com/levy-oliveira/todo_list/controllers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/logout", controllers.Logout)
	app.Get("/api/todo", controllers.GetTodosByUserID)
	app.Get("/api/todo/:name", controllers.GetTodoByName)
	app.Post("/api/create", controllers.CreateTodo)
	app.Put("/api/update/:id", controllers.UpdateTodoForUser)
	app.Delete("/api/delete/:id", controllers.DeleteTodoForUser)
}