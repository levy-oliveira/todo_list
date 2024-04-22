package models
//Struct de usuário
type User struct {
	Id       uint `json:"id"`
	Name     string `json:"name"`
	Login    string `json:"login" gorm:"unique"` 
	Password []byte `json:"password"`
}
