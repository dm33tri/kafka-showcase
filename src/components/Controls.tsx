import { FC, useCallback, useEffect } from "react";
import { useSendMessageMutation } from "../services/messages";
import { useCreateConsumerMutation, useCreateProducerMutation } from "../services/nodes";

export const Controls: FC = () => {
    const [createConsumer] = useCreateConsumerMutation()
    const [createProducer] = useCreateProducerMutation()
    const [sendMessage] = useSendMessageMutation()

    useEffect(() => {
        setInterval(() => {
            sendMessage()
        }, 1000)
    }, [])
    const onClick = useCallback(() => {
        createConsumer(0)
        createProducer(0)
    }, [createConsumer, createProducer])
    return <button onClick={onClick}>+</button>
}