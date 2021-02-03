import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import { api } from '../../config/api'
import logo from '../../assets/logo.png'

function Login(props) {
  const [auth, setAuth] = useState({})
  const [error, setError] = useState({})
  const [loading, setLoading] = useState(false)

  const admin = props.match.url === '/admin' ? true : false
  const exit = props.match.url === '/sair' ? true : false
  const token = localStorage.getItem('token')
  
  let history = useHistory()

  useEffect(() => {
    if (exit) {
      localStorage.removeItem('token')  
    }
  }, [exit])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const res = await api.get(`/users/type`, 
            { headers :{
              'x-access-token' : localStorage.getItem('token')
            }})

          const { type } = res.data

          if (type === 'admin') {
            history.push('/admin-inicial')
          } else {
            if (type === 'regular') {
              history.push('/inicial')
            }
          } 
        }
      } catch (error) {}
    }
    fetchData()
  }, [token, history])

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError({})
      const res = await api.post(`/users/login/${admin ? 'admin' : ''}`, auth)
      const { id, type, token } = res.data
      finishLogin(id, type, token)
    } catch (err) {
      if ((err.hasOwnProperty('response')) && (err.response)) {
        setError(err.response.data)
      } else {
        alert('Você está sem internet ou o nosso servidor está fora do ar')
      }
      setLoading(false)
    }
  }

  const finishLogin = (id, type, token) => {
    localStorage.setItem('token', token)
    
    setLoading(false)
    if (type === 'admin') {
      history.push('/admin-inicial')
    } else {
      history.push('/inicial')
    }
  }

  return (
    <div className="container container-login">
      <form>
        <div className="text-center mb-3">
          <img className="mb-3 img-login" src={ logo } alt="Logo" />
          <h5>Sistema de reserva</h5>
        </div>

        <div className="mb-2">
          <label htmlFor="cpf" className="form-label">CPF</label>

          <input type="text" 
                 className={`form-control ${error.cpf ? 'is-invalid' : ''}`}
                 id="cpf" 
                 maxLength="11" 
                 value={auth.cpf || ''} 
                 onChange={e => {
                  const re = /^[0-9\b]+$/
                  const key = e.target.value
      
                  if (key === '' || re.test(key)) {
                    setAuth({ ...auth, cpf: key })
                  }
                 }}
          />

          <div id="validationCpf" 
               className="invalid-feedback" 
               style={error.cpf ? { display: 'inline' } : { display: 'none' }}>
               {error.cpf}
          </div>
        </div>
        
        <div className="mb-2">
          <label htmlFor="password" className="form-label">Senha</label>

          <input type="password" 
                 className={`form-control ${error.password ? 'is-invalid' : ''}`}
                 id="password" 
                 maxLength="8" 
                 onChange={e => {
                  setAuth({ ...auth,
                    password: e.target.value
                  })
                 }}
          />

          <div id="validationPassword" 
               className="invalid-feedback" 
               style={error.password ? { display: 'inline' } : { display: 'none' }}>
            {error.password}
          </div>
        </div>

        <div className="mb-3">
          <Link to="/email-redefine-senha">Esqueci minha senha</Link>
        </div>

        <div className="text-center d-grid gap-2">
          <button type="button" 
                  className="btn btn-primary"
                  onClick={handleLogin}
                  disabled={loading}>
            <span className="spinner-border spinner-border-sm mx-1" 
                  role="status" 
                  aria-hidden="true" 
                  style={loading ? { display: 'inline-block'} : { display : 'none' }}>
            </span>
            Entrar
          </button>

          <button type="button" 
                  className="btn btn-warning text-white" 
                  style={admin ? { display: 'none' } : { display: 'inline-block' }}
                  onClick={() => {
                    history.push('/registro')
                  }}>
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
