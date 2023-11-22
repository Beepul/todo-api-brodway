const express = require('express');
const {requestMiddleware,checkPerson, validateToken} = require('./middlewares/middlewares');
const jwt = require('jsonwebtoken');
const db = require('./db');
const Todo = require('./Schema/todo');


const main  =  async () => {
    const app = express();
    app.use(express.json());
    
    const port = 5000;
    const JWT_SECRET = "dFD88qIdFQ8AypcEj1VSeoEEC+t5rccNFY1h2v3RRQSjATKccq1GpApFG1Rm1krf01HogjYMh6m384ZOn6eGuQ=="

    await db()
    
    let todos = [];
    let tokens = [];
    app.use(requestMiddleware)
    // Create
    app.post('/todo',async (req,res) => {
        const {title} = req.body;
        if(!title){
            return res.status(403).json({
                message: "Title is empty !!!"
            });
        }
        const todo = await Todo.create({title})

        res.status(201).json({
            message: 'success',
            todo
        })
    })
    
    // Read
    app.get('/todo', validateToken,async (req,res) => {
        const todos = await Todo.find()
        res.status(200).json({
            message: `Sucess. Trying to access by: ${req.user}`,
            todos: todos
        })
    })
    
    // Read by Id
    app.get('/todo/:id',(req,res) => {
        const {id} = req.params;
        const todo = todos.find(item => {
            return item.id == id
        });
        if(!todo){
            return res.status(404).json({
                message: `Todo with ${id} not found`
            })
        }
        res.status(200).json({
            message: "Success",
            todo: todo
        })
    })
    
    // Update
    app.put('/todo/:id',async (req,res) => {
        const {id} = req.params;
        const {title} = req.body;

        if(!title){
            return res.status(400).json({
                message: 'Title is required'
            })
        }
        
        try {
            const todo = await Todo.findById(id)
            if(!todo){
                return res.status(404).json({
                    message: 'Todo not found'
                })
            }

            todo.title = title 

            todo.save()

            res.status(200).json({
                message: 'success',
                todo
            })
            
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    })
    
    // Delete
    app.delete('/todo/:id', async (req,res) => {
        const {id} = req.params;
        
        try {
            const todo = await Todo.findById(id)

            if(!todo){
                res.status(404).json({
                    message: 'Todo not found'
                })
            }

            await Todo.findByIdAndDelete(id)

            res.status(200).json({
                message: 'Todo deleted successfully'
            })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    })
    
    
    // login
    app.post('/login',(req,res) => {
        const {username,password} = req.body;
    
        if(!username || !password){
            return res.status(400).json({message: 'all feilds required'})
        }
        if(username !== 'bipul' || password !== '123456'){
            return res.status(401).json({message: 'Username or password doesnot match'})
        }
        const token = jwt.sign({username},JWT_SECRET,{expiresIn: '1d'})
        tokens.push(token);
        res.status(200).json({token})
    })
    
    // logout
    app.delete('/logout',validateToken,(req,res) => {
        const token = req.token;
        const filteredTokens = tokens.filter(item => item !== token);
        tokens = filteredTokens
        res.status(200).json({message: 'Sucessfully logged out'})
    })
    
    
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`)
    })

}    

main()