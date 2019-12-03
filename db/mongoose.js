const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://pradeep_giri_:Gaytridetwal@123@cluster0-wooqu.mongodb.net/QuizApp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})