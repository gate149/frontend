'use client';

import React, {useEffect, useRef, useState} from 'react';
import {SolutionsList} from '@/components/SolutionsList';
import type {SolutionsListItem} from '../../../contracts/tester/v1';

const MessageTypeCreate = "CREATE";
const MessageTypeUpdate = "UPDATE";
const MessageTypeDelete = "DELETE";

interface Message {
    message_type: string;
    message?: string;
    solution: SolutionsListItem;
}

interface SolutionsListWithWebSocketProps {
    initialSolutions: SolutionsListItem[];
    wsUrl: string;
    token: string;
    queryParams: Record<string, string | number | undefined>;
}

const SolutionsListWithWS: React.FC<SolutionsListWithWebSocketProps> = (
    {
        initialSolutions,
        wsUrl,
        token,
        queryParams
    }
) => {
    const [solutions, setSolutions] = useState<SolutionsListItem[]>(initialSolutions);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        console.log(queryParams)

        if (!(queryParams.page === 1 && queryParams.order === -1)) {
            return;
        }

        const websocket =  new WebSocket(`${wsUrl}?token=${token}`);

        websocket.onopen = () => {
            console.log('WebSocket connected');
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as Message;

                if (data.message_type === MessageTypeCreate) {

                    setSolutions((prevSolutions) => [data.solution, ...prevSolutions.slice(0, -1)]);
                    return;
                }

                if (data.message_type === MessageTypeUpdate) {

                    setSolutions((prevSolutions) =>
                        prevSolutions.map((solution) => {
                            if (solution.id === data.solution.id) {
                                if (data.message) {
                                    // FIXME
                                    // @ts-ignore
                                    data.solution.state = data.message;
                                }

                                return data.solution;
                            }

                            return solution;
                        })
                    );
                    return;
                }

                if (data.message_type === MessageTypeDelete) {

                    setSolutions((prevSolutions) =>
                        prevSolutions.filter((solution) => solution.id !== data.solution.id)
                    );
                    return;
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        websocket.onclose = () => {
            console.log('WebSocket disconnected');
            ws.current = null;
        };

        ws.current = websocket;

        return () => {
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.close();
            }
        };
    }, [wsUrl, token, queryParams]);

    useEffect(() => {
        setSolutions(initialSolutions);
    }, [initialSolutions]);

    return <SolutionsList solutions={solutions}/>;
};

export {SolutionsListWithWS};