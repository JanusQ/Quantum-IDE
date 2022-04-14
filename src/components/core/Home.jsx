import React from 'react'
import { useSelector } from 'react-redux'
import Layout from './Layout'
const Home = () => {
	const state = useSelector((state) => state)
	return (
		<div>
			<Layout>Home {JSON.stringify(state)}</Layout>
		</div>
	)
}
export default Home
