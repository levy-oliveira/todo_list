package controllers

import "github.com/gofiber/fiber/v2"
import "github.com/levy-oliveira/todo_list/models"

func Register(c *fiber.Ctx) error {
    var data map[string]string
        if err := c.BodyParser(&data); err != nil {
            return err
        }
		user := models.User{
            Name: data["name"],
            Login: data["login"],
            Password: data["password"],
        }
	return c.JSON(user)
}