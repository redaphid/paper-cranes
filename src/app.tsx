import React, { useCallback, useState } from "react";
import AudioVisualizer from "./AudioVisualizer";
export const App = (props: { message: string }) => {
    const [count, setCount] = useState(0);
    const increment = useCallback(() => {
        setCount(count => count + 1);
    }, [count]);
    return(<>
            <h1>{props.message}</h1>
            <button onClick={increment}>count is: {count}</button>
            <AudioVisualizer />
    </>)
};

