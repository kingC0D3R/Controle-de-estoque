import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'item',
    title: 'Gerenciamento',
    subtitle: 'CRUD'
}

const baseUrl = 'http://localhost:3001/items'
const initialState = {
    item: { name: '', qA: 0, qM: 0, cost: 0, pS: 0},
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    //Retorna estado inicial item
    clear() {
        this.setState({ item: initialState.item })
    }

    //Salva item
    save() {
        const item = this.state.item
        const method = item.id ? 'put' : 'post'
        const url = item.id ? `${baseUrl}/${item.id}` : baseUrl
        console.log(item.id)
        axios[method](url, item)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ item: initialState.item, list })
            })
    }

    //Atualiza lsita de itens
    getUpdatedList(item, add = true) {
        const list = this.state.list.filter(u => u.id !== item.id)
        if (add) list.unshift(item)
        return list
    }

    //Atualiza campo de items
    updateField(event) {
        const item = { ...this.state.item }
        item[event.target.name] = event.target.value
        this.setState({ item })
    }

    //Atualiza campo de items para numerico operacional.
    updateFieldNumber(event) {
        const item = { ...this.state.item }
        item[event.target.name] = parseInt(event.target.value, 10)
        this.setState({ item })
    }

    //nome do produto, a quantidade atual, quantidade mínima, o custo e o preço de revenda.
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome do Produto</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.item.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome do produto..." />
                        </div>
                    </div>

                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Quantidade Atual</label>
                            <input type="number" pattern='[0-9]{0,5}' className="form-control"
                                name="qA"
                                value={this.state.item.qA}
                                onChange={e => this.updateFieldNumber(e)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-3">
                        <div className="form-group">
                            <label>Quantidade Minima</label>
                            <input type="number" pattern='[0-9]{0,5}' className="form-control"
                                name="qM"
                                value={this.state.item.qM}
                                onChange={e => this.updateFieldNumber(e)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Custo</label>
                            <input type="number" pattern='[0-9]{0,5}' className="form-control"
                                name="cost"
                                value={this.state.item.cost}
                                onChange={e => this.updateFieldNumber(e)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-2">
                        <div className="form-group">
                            <label>Preço de venda</label>
                            <input type="number" pattern='[0-9]{0,5}' className="form-control"
                                name="pS"
                                value={this.state.item.pS}
                                onChange={e => this.updateFieldNumber(e)} />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    //Carrega item para edição.
    load(item) {
        this.setState({ item })
    }

    //Remove o item.
    remove(item) {
        axios.delete(`${baseUrl}/${item.id}`).then(resp => {
            const list = this.getUpdatedList(item, false)
            this.setState({ list })
        })
    }

    //incrementa item
    inc(item) {
        this.setState({ item })
        item.qA = item.qA + 1

        const url = item.id ? `${baseUrl}/${item.id}` : baseUrl
        axios.put(url, item)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ item: initialState.item, list })
            })

    }

    //decrementa item
    dec(item) {
        this.setState({ item })
        item.qA = item.qA - 1

        const url = item.id ? `${baseUrl}/${item.id}` : baseUrl
        axios.put(url, item)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ item: initialState.item, list })
            })

    }

    //notificaçao de item
    notify(item) {
        if (item.qA > item.qM) {
            return <div className="alert alert-success mb-0" role="alert">Quantia Atual</div>
        } else if (item.qA === item.qM) {
            return <div className="alert alert-warning mb-0" role="alert">Quantia Atual</div>
        } else {
            return <div className="alert alert-danger mb-0" role="alert">Quantia Atual</div>
        }
    }

    //totaliza quantidade de itens
    totalizadorQuantia() {
        var x = 0
        this.state.list.map(item => {
            return x = x + item.qA
        })
        return x
    }

    //totaliza receita de itens
    totalizadorReceita() {
        var x = 0
        this.state.list.map(item => {
            return x = x + (item.qA * item.cost)
        })
        return x
    }

    findfile() {


    }

    //renderiza a parte superior da tabela header.
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome do Produto</th>
                        <th>Quantia Atual</th>
                        <th>Quantia Minima</th>
                        <th>Custo (R$)</th>
                        <th>Preço (R$)</th>
                        <th>Notificação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
                <thead>
                    <tr>
                        <th></th>
                        <th>Total =</th>
                        <th>{this.totalizadorQuantia()}</th>
                        <th></th>
                        <th>{this.totalizadorReceita()}(R$)</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
            </table>
        )
    }

    //renderiza a parte inferior da tabela com valores.
    renderRows() {
        return this.state.list.map(item => {
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.qA}</td>
                    <td>{item.qM}</td>
                    <td>{item.cost} (R$)</td>
                    <td>{item.pS} (R$)</td>
                    <td>{this.notify(item)}</td>
                    <td>
                        <button className="btn btn-warning btn-lg"
                            onClick={() => this.load(item)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2 btn-lg"
                            onClick={() => this.remove(item)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        <button className="btn  btn-dark ml-2 btn-lg"
                            onClick={() => this.inc(item)}>
                            <i className="fa fa-plus"></i>
                        </button>
                        <button className="btn  btn-dark ml-2 btn-lg"
                            onClick={() => this.dec(item)}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    //renderização total parte userCrude.
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}