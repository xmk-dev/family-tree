"use client";

import { API_ROUTES } from "@/constants/routes";
import { useCallback, useRef, useState } from "react";

export const Command: React.FC = () => {
  const [result, setResult] = useState();
  const commandInputRef = useRef<HTMLInputElement>(null);
  const handleCommand = useCallback(async () => {
    if (!commandInputRef?.current?.value) {
      return;
    }

    const response = await fetch(API_ROUTES.EXECUTE_COMMAND, {
      method: "post",
      body: JSON.stringify({ command: commandInputRef.current.value }),
    });
    const responseJson = await response.json();

    setResult(responseJson);
  }, [commandInputRef]);

  return (
    <>
      <div className="w-full max-w-6xl bg-gray-100/20 rounded-xl p-8 shadow-xl">
        <h2 className="mb-4 font-light">Result:</h2>
        {result && <p className="font-normal text-xl">{result}</p>}
      </div>
      <form className="w-full max-w-6xl">
        <div className="flex items-center border-b border-gray-100 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Command ..."
            aria-label="Command"
            ref={commandInputRef}
          />
          <button
            className="flex-shrink-0 bg-gray-100 hover:bg-gray-300 border-gray-100 hover:border-gray-300 text-sm border-4 text-gray-900 py-1 px-2 rounded"
            type="button"
            onClick={handleCommand}
          >
            exec
          </button>
        </div>
      </form>
    </>
  );
};
