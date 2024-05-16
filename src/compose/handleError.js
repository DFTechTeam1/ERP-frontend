export function useError(response, setErrors) {
    if ((response.response != undefined) && (response.response.status == 422)) {
        for (let key in response.response.data.errors) {
            setErrors({
                [key]: response.response.data.errors[key],
            })
        }
    }
}