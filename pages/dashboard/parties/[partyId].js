
import React from 'react'
import { useRouter } from 'next/router'
import Wrapper from '../../../components/Wrapper'
const Party = () => {
    const router = useRouter()
    return (
        <Wrapper>
            {router.query.partyId}
        </Wrapper>
    )
}

export default Party
