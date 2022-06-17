import { FC, useEffect } from "react";
import { useCreateConsumerMutation, useCreateProducerMutation } from "../services/nodes";

export const Controls: FC = () => {
    const [createConsumer] = useCreateConsumerMutation()
    const [createProducer] = useCreateProducerMutation()
    useEffect(() => {
        createConsumer(0)
        createProducer(0)
    }, [])
    return null
}