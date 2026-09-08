const { default: mongoose } = require("mongoose");
const Todo = require("../models/todoSchema");
const User = require("../models/userSchema");

const allTodos = async (req, res) => {
    console.log('we are in todo /');

    const { email } = req.user
    console.log(req.body);

    console.log(email);

    const user = await User.findOne({ email })
    console.log(user);
    const user_id = user._id;

    const todos = await Todo.find({ user_id });



    res.json({
        message: `Welcome to the Todo page. Mr.${user.username}`,
        todos: todos
    })
}

const TodoOne = async (req, res) => {
    const { id } = req.params;
    console.log('id is', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }
    try {
        const getTodo = await Todo.findOne({_id : id , user_id: req.user.userId});
        if (!getTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }
        console.log(getTodo);
        return res.json({
            message: 'todo get succesfully ',
            todo: getTodo
        })
    } catch (error) {
        return res.json({ message: 'Enter valid id' })
    }

}

const createTodo = async (req, res) => {
    const { title, description, status } = req.body;
    console.log(title, description, status);


    const user = req.user;
    const user_id = user.userId;
    console.log(user_id);
    const trimStatus = status.trim();
    if (!title.trim()) {
        return res.json({ message: 'Plz enter title' })
    }
    const ALLOWED_STATUSES = ["pending", "in-progress", "completed"];
    if (trimStatus && !ALLOWED_STATUSES.includes(trimStatus)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        });
    }
    const createTodo = await Todo.create({ title, description, status, user_id })
    res.json({
        message: '${user.username} todo is created',
        todo: createTodo,
    })
}

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    console.log('id is update', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }
    const trimStatus = status.trim();
    if (!title.trim()) {
        return res.json({ message: 'Plz enter title' })
    }
    const ALLOWED_STATUSES = ["pending", "in-progress", "completed"];
    if (trimStatus && !ALLOWED_STATUSES.includes(trimStatus)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        });
    }


    try {
        const updateTodo = await Todo.findOneAndUpdate(
            { _id: id  , user_id : req.user.userId},
            { $set: { title: title, description: description, status: status } },
            { new: true, runValidators: true }
        );
        if (!updateTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        return res.json({ message: 'todo updated ', todo: updateTodo })
    } catch (error) {
        return res.json({ message: `the erro occur updaytefaield ${error}` })
    }



}

const deleteTodo = async (req, res) => {
    const { id } = req.params;
    console.log('id is delete', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
        });
    }
try {
    const deleteTodo = await Todo.findOneAndDelete({ _id: id , user_id : req.user.userId });

    if (!deleteTodo) {
        return res.json({
            message: 'plz enter valid id or this id cant find'
        })
    }
    return res.json({
        message: 'teh todo is deleted',
        todo: deleteTodo
    })


} catch (error) {
     return res.json({
            message: `some issue happen in database ${error}`
        })
}
    
}


const StatusUpdate = async (req,res)=>{
        

const validStatuses = ['pending', 'in-progress', 'completed'];


  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id,status);

    console.log(`staust = ${id} , user = ${req.user.userId}`);
    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({ message: 'Invalid Todo ID format' });
}

    // 1. Validate status input
    if (!status) {
      return res.status(400).json({ message: 'Status field is required' });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // 2. Find and update ONLY if the todo belongs to the authenticated user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, user_id: req.user.userId },
      { $set: { status: status } },
      { returnDocument: 'after', runValidators: true }
    );
    console.log(updatedTodo);
    
    // 3. Handle not found or unauthorized
    if (!updatedTodo) {
        console.log('not hsppen');
        
      return res.status(404).json({
        message: 'Todo not found or you are not authorized to update it',
      });
    }

    // 4. Return success response
    return res.status(200).json({
      message: 'Status updated successfully',
      todo: {
        id: updatedTodo._id,
        title: updatedTodo.title,
        description: updatedTodo.description || '',
        status: updatedTodo.status,
      },
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = { TodoOne, createTodo, StatusUpdate, allTodos, updateTodo, deleteTodo }