import { Button } from 'antd'
import React from 'react'
// import { getUserInformation } from '../../api/auth'
import { useHistory } from 'react-router-dom'
const Test = () => {
	const history = useHistory()
	const sendPost = () => {
		// getUserInformation()
		history.push('/')
	}
	return (
		<div>
			<Button onClick={sendPost}>Test</Button>
		</div>
	)
}

export default Test
