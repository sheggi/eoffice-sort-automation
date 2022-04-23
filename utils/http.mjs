export async function postJson(url, data, bearer) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    if (bearer) {
        headers.Authorization = `Bearer ${bearer}`
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    })

    if (response.status == 204)
        return

    return await response.json()
}

export async function getJson(url, query, bearer) {
    const headers = {
        'Accept': 'application/json',
    }
    if (bearer) {
        headers.Authorization = `Bearer ${bearer}`
    }

    if (query) {
        url += `?${new URLSearchParams(query)}`
    }

    const response = await fetch(url, {
        headers
    })

    return response.json()
}
