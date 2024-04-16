package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/levy-oliveira/todo_list/models"
	"github.com/levy-oliveira/todo_list/database"
	"strings"
)

// Função para buscar uma task de um usuário pelo nome
func GetTodoByName(c *fiber.Ctx) error {
	// Extrair o token JWT do cabeçalho de autorização
	tokenString := c.Get("Authorization")
	if tokenString == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Token de autorização não encontrado")
	}

	// Remover "Bearer " do cabeçalho
	token := strings.Replace(tokenString, "Bearer ", "", 1)
	// Extrair o ID do usuário do token JWT
	userID, err := extractUserIDFromToken(token)
	if err != nil {
		return err
	}

	// Extrair o nome da task dos parâmetros da rota
	taskName := c.Params("name")

	// Buscar a task no banco de dados pelo nome e ID do usuário
	var todo models.List
	if err := database.DB.Where("name LIKE ? AND user_id = ?", "%"+taskName+"%", userID).First(&todo).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Task não encontrada")
	}

	// Retornar a task encontrada como resposta
	return c.JSON(todo)
}

func GetTodosByUserID(c *fiber.Ctx) error {
    // Extrair o token JWT do cabeçalho de autorização
    tokenString := c.Get("Authorization")
    if tokenString == "" {
        return fiber.NewError(fiber.StatusUnauthorized, "Token de autorização não encontrado")
    }
	// Remover "Bearer " do cabeçalho
	token := strings.Replace(tokenString, "Bearer ", "", 1)	
    // Extrair o ID do usuário do token JWT
    userID, err := extractUserIDFromToken(token)
    if err != nil {
        return err
    }

    // Consultar o banco de dados para obter TODOS vinculados ao ID do usuário
    var todos []models.List
    if err := database.DB.Where("User_id = ?", userID).Find(&todos).Error; err != nil {
        return err
    }

    // Retornar os TODOS encontrados
    return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"todos": todos,
		},
	})
}

func CreateTodo(c *fiber.Ctx) error {
    // Extrair o token JWT do cabeçalho de autorização
    tokenString := c.Get("Authorization")
    if tokenString == "" {
        return fiber.NewError(fiber.StatusUnauthorized, "Token de autorização não encontrado")
    }
	// Remover "Bearer " do cabeçalho
	token := strings.Replace(tokenString, "Bearer ", "", 1)	
	// Extrair o ID do usuário do token JWT
	userID, err := extractUserIDFromToken(token)
    if err != nil {
        return err
    }
	
    // Parse dos dados do pedido para obter os detalhes do TODO
    var todoData models.List
    if err := c.BodyParser(&todoData); err != nil {
        return err
    }

	if todoData.User_id != userID {
        return fiber.NewError(fiber.StatusUnauthorized, "Usuário não autorizado para atualizar este TODO")
    }
    // Atribuir o ID do usuário ao TODO
    todoData.User_id = userID

    // Criar o novo TODO no banco de dados
    if err := database.DB.Create(&todoData).Error; err != nil {
        return err
    }

    if err := c.JSON(todoData); err != nil {
        return err
    }
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
		"todos": todoData,
		},
	})
}

// Função para atualizar um TODO vinculado ao ID do usuário
func UpdateTodoForUser(c *fiber.Ctx) error {

    // Extrair o token JWT do cabeçalho de autorização
    tokenString := c.Get("Authorization")
    if tokenString == "" {
        return fiber.NewError(fiber.StatusUnauthorized, "Token de autorização não encontrado")
    }

    // Remover "Bearer " do cabeçalho
	token := strings.Replace(tokenString, "Bearer ", "", 1)	
    // Extrair o ID do usuário do token JWT
    userID, err := extractUserIDFromToken(token)
    if err != nil {
        return err
    }
    // Extrair o ID da task dos parâmetros da rota
	taskID := c.Params("id")

    // Buscar a task no banco de dados pelo ID
	var todoData models.List
	if err := database.DB.First(&todoData, taskID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Task não encontrada")
	}
    
    // Verificar se o ID do usuário no TODO corresponde ao ID do usuário no token JWT
    if todoData.User_id != userID {
        return fiber.NewError(fiber.StatusUnauthorized, "Usuário não autorizado para atualizar este TODO")
    }

    // Parse dos dados do pedido para obter os detalhes da task a ser atualizada
	var updatedTodoData models.List
	if err := c.BodyParser(&updatedTodoData); err != nil {
		return err
	}

    // Atualizar a task no banco de dados com os dados do corpo da requisição
	if err := database.DB.Model(&todoData).Updates(&updatedTodoData).Error; err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
		"todo": todoData,
		},
	})
}

// Função para deletar um TODO vinculado ao ID do usuário
func DeleteTodoForUser(c *fiber.Ctx) error {
    // Extrair o token JWT do cabeçalho de autorização
    tokenString := c.Get("Authorization")
    if tokenString == "" {
        return fiber.NewError(fiber.StatusUnauthorized, "Token de autorização não encontrado")
    }

    // Remover "Bearer " do cabeçalho
	token := strings.Replace(tokenString, "Bearer ", "", 1)	
    // Extrair o ID do usuário do token JWT
    userID, err := extractUserIDFromToken(token)
    if err != nil {
        return err
    }

    // Extrair o ID do TODO a ser deletado dos parâmetros da rota
    taskID := c.Params("id")

    // Buscar a task no banco de dados pelo ID
    var todo models.List
    if err := database.DB.First(&todo, taskID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Task não encontrada")
	}

    // Verificar se o ID do usuário no TODO corresponde ao ID do usuário no token JWT
    if todo.User_id != userID {
        return fiber.NewError(fiber.StatusUnauthorized, "Usuário não autorizado para atualizar este TODO")
    }

    // Deletar o TODO do banco de dados
    if err := database.DB.Delete(&todo).Error; err != nil {
        return err
    }

    return c.JSON(fiber.Map{"message": "Task deletada com sucesso"})
}