import { FC, PropsWithChildren } from "react";

const AuthorizedLayout:FC<PropsWithChildren> = ({children, ...props})=>{
    return (
        <div className="min-h-full authorized-layout">
           {children} 
        </div>
    )
}

export default AuthorizedLayout