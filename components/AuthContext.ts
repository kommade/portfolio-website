"use client";

export default function isLoggedIn() {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("token") !== null;
    }
    return false
}

export function getToken() {
    if (isLoggedIn()) {
        return localStorage.getItem("token");
    }
    return null;
}

export const logout = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem("token");
    }
}