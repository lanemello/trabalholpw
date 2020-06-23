const express = require ('express')
const server = express ()

server.use(express.json())
server.use((request, response, next) => 
{
    console.log('Controle de estoque da empresa ABC')
    return next ()
})
const produto = [{id: 754, name: 'cerveja', qty : 500 , uvalue:5 , totprice:10}]
const verificarId = (request, response, next) =>
{
    const id = request.params.id 
    const crecebe = produto.find(vproduto => 
	{
        return vproduto.id == id
    })   
    if (crecebe === undefined)
	{
        return response.status(400).json({erro:'Não existe produto com este id.'})
    }
    return next()
}
function calc(produto) 
{
    for (let i = 0; i < produto.length; i++) 
	{
      produto[i].totprice = produto[i].qty * produto[i].uvalue
      produto[i].veprice = produto[i].uvalue * 1.2
      produto[i].lucro = produto[i].veprice - produto[i].uvalue
      if (produto[i].qty < 50) 
	  {
        produto[i].situation = 'A situação do produto é estável'
      } else if (produto[i].qty >= 50 && produto[i].qty < 100
      ) 
	  {
        produto[i].situation = 'A situação do produto é boa'
      } else if (produto[i].qty >= 100) 
	  {
        produto[i].situation = 'A situação do produto é excelente'
      }
    }
  }
function verificarCampo(request, response, next) 
{
    const { id, name_produto, qty, uvalue, totprice } = request.body;
    if(id === '' || name_produto == '' || qty === ''|| uvalue === ''|| totprice === '') {
      return response.status(400).json({ mensagem: 'O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição' })
    }
    return next()
  }
server.get('/produtos', (request, response) => 
{
    return response.json(produto)
})

server.get('/produtos/:id', verificarId, (request, response) => 
{
    const id = request.params.id
    const filtro = produto.filter (verif => 
	{
        return verif.id == id
    })
    return response.json (filtro)
})

server.post('/produtos', verificarCampo, (request, response) => 
{
    produto.push(request.body)
    const plast = produto[produto.length - 1]
    calc(produto)
    return response.json(plast)
  })
  
  server.put('/produtos', verificarCampo, (request, response) => 
  {
    const id = request.body.id
    let indice = 0
    let fproduto = produto.filter( (produto, index) => 
	{
      if(produto.id === id) {
        indice = index
        return produto.id === id
      }
    })
  
    if(fproduto.length === 0) 
	{
      return response.status(400).json({ mensagem: 'Não existe produto com este id'})
    }
    produto[indice] = request.body
    return response.json(produto)
  })
  
  
  server.delete('/produtos',(request, response) => 
  {
    const id = request.body.id
    const fproduto = produto.find( (prod, index) => 
	{
      if(prod.id == id) {
        produto.splice(index, 1)
        return prod.id == id
      }
    })
    if(!fproduto) 
	{
      return response.status(400).json({ mensagem: 'Não existe produto com este id'})
    }
  
    return response.json(produto)
  })
  
  server.post('/produtos/:id/complemento', verificarId, (request, response) => 
  {
    const comp = request.body.complemento
    const id = request.params.id;
    for(let i = 0; i < produto.length; i++) 
	{
      if(produto[i].id === Number(id)) 
	  {
        produto[i].comp.push(comp)
      }
    }
    return response.json(produto)
  })
server.listen (3333)