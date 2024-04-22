package controllers

import (
	"strconv"
	"time"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/levy-oliveira/todo_list/database"
	"github.com/levy-oliveira/todo_list/models"
	"golang.org/x/crypto/bcrypt"
)

//Registra um novo usuário
func Register(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	user := models.User{
		Name:     data["name"],
		Login:    data["login"],
		Password: password,
	}
	database.DB.Create(&user)
	return c.JSON(fiber.Map{"message": "Registro realizado com sucesso"})
}

//Função de login de usuário
func Login(c *fiber.Ctx) error {
	//get the request parameter
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	//get user by email
	database.DB.Where("login = ?", data["login"]).First(&user)
	//user not found
	if user.Id == 0 {
		c.Status(404)
		return c.JSON(fiber.Map{
			"message": "User not found!",
		})
	}
	//incorrect password
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(400)
		return c.JSON(fiber.Map{
			"message": "Incorrect password!",
		})
	}
	
	claims := jwt.MapClaims{
		"sub": strconv.Itoa(int(user.Id)),
		"exp": jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
	}
	
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := jwtToken.SignedString([]byte("secret"))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}
	 // Redirecionar para GetTodosByUserID com o token no cabeçalho de autorização
	 c.Set("Authorization", "Bearer "+ token)
	 //return c.Redirect("/api/todo", fiber.StatusTemporaryRedirect)
	 return c.JSON(fiber.Map{
        "token": token,
        "message": "Login bem-sucedido",
		"nome": user.Name,
    })
}

//Função de logout de usuário
func Logout(c *fiber.Ctx) error {
    cookie := fiber.Cookie{
        //Definir o valor do cookie como vazio e adicionar uma data de expiração no passado.
        Name: "jwt",
        Value: "",
        //No código da função de logout, remover o cookie definindo o mesmo cookie no passado ( '-' ).
        Expires: time.Now().Add(-time.Hour),
        HTTPOnly: true,
    }
    c.Cookie(&cookie)
    //Retornar uma resposta de sucesso em formato JSON.
    return c.JSON(fiber.Map{
        "message": "success",
    })
}

//Extrair id do usuário pelo token
func extractUserIDFromToken(tokenString string) (uint, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte("secret"), nil
    })
    if err != nil {
        return 0, err
    }

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        if userID, ok := claims["sub"].(string); ok {
            id, err := strconv.Atoi(userID)
            if err != nil {
                return 0, err
            }
            return uint(id), nil
        }
    }

    return 0, fiber.NewError(fiber.StatusUnauthorized, "Token inválido")
}