package models

type List struct {
    Id uint `json:"id"`
    Name string `json:"name"`
    Decription string `json:"description"`
    Status bool `json:"status"`
	User_id uint `json:"userId"`
}