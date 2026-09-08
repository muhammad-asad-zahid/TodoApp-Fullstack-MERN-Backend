const express = require('express')
const { allTodos,  createTodo, deleteTodo, updateTodo, TodoOne, StatusUpdate } = require('../controllers/todoController')
const authUser = require('../middlewares/auth')

const router = express.Router()

router.get('/',authUser,allTodos)
 router.get('/todo/:id',authUser , TodoOne)
 router.post('/create',authUser ,createTodo)
 router.delete('/delete/:id',authUser,deleteTodo)
 router.put('/update/:id',authUser, updateTodo)
 router.put('/:id',authUser,StatusUpdate)

 module.exports = router;