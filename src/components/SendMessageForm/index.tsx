import { useContext, useState, FormEvent } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../context/auth'
import { api } from '../../services/api'
import styles from './styles.module.scss'

export function SendMessageForm(){
    const { user, signOut } = useContext(AuthContext)
    const [message, setMessage] = useState('')

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault()

        if(!message.trim()){
            return
        }

        await api.post('messages', { message })

        setMessage('')
    }

    return(
        <div className={styles.sendMessageFormWrapper}>
            <button className={styles.signOutButton} onClick={signOut}>
                <VscSignOut size="32" />
            </button>
            <header className={styles.userInformation}>
                <div className={styles.userImage}>
                    <img src={user?.avatar_url} alt={`Avatar ${user?.name}`} />
                </div>
                <strong className={styles.userName}>{user?.name}</strong>
                <span className={styles.userGithub}>
                    <VscGithubInverted size="16" />
                    {user?.login}
                </span>
            </header>

            <form className={styles.sendMessageForm} onSubmit={ handleSubmit } >
                <label htmlFor="message">Mensagem</label>
                <textarea 
                    name="message" 
                    id="message" 
                    placeholder="Digite sua mensagem"
                    value={message} 
                    onChange={e => setMessage(e.target.value)}></textarea>
                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}