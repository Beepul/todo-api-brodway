const arr = [
    {
        title: "new todo",
        id: 1
    },{
        title: "sec todo",
        id: 2
    }
]

const newArr = arr.filter(item => {
    console.log(item.id)
    console.log(item.title)
    if(item.id !== 1){
        return item
    }
})

console.log(newArr)