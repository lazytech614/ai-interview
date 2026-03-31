import { useState } from "react"
import { toast } from "sonner"

const useFetch = (cb: any) => {
    const [data, setData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fn = async (...args: any) => {
        setLoading(true)
        setError(null)
        try {
            const result = await cb(...args)
            setData(result)
            setError(null)
        } catch (err) {
            setError(err as any)
            toast.error((err as any).message)
        } finally {
            setLoading(false)
        }
    }

    return {
        data,
        loading,
        error,
        fn,
        setData
    }
} 

export default useFetch