'use client';

import React from 'react';
import {Pagination} from '@mantine/core';
import Link from 'next/link';
import * as testerv1 from '../../contracts/tester/v1';

interface NextPaginationProps {
    pagination: testerv1.Pagination;
    baseUrl: string;
    queryParams?: Record<string, string | number | undefined>;
}

const NextPagination = ({pagination, baseUrl, queryParams = {}}: NextPaginationProps) => {
    // Helper function to build query string
    const buildQueryString = (params: Record<string, string | number | undefined>) => {
        const validParams = Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== '')
            .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`);
        return validParams.length > 0 ? `?${validParams.join('&')}` : '';
    };

    const getItemProps = (page: number) => ({
        component: Link,
        href: `${baseUrl}${buildQueryString({...queryParams, page})}`,
    });

    const getControlProps = (control: 'first' | 'previous' | 'last' | 'next') => {
        if (control === 'next') {
            const nextPage = pagination.page === pagination.total ? pagination.page : pagination.page + 1;
            return {
                component: Link,
                href: `${baseUrl}${buildQueryString({...queryParams, page: nextPage})}`,
            };
        }

        if (control === 'previous') {
            const prevPage = pagination.page === 1 ? pagination.page : pagination.page - 1;
            return {
                component: Link,
                href: `${baseUrl}${buildQueryString({...queryParams, page: prevPage})}`,
            };
        }

        return {};
    };

    return (
        <Pagination
            total={pagination.total}
            value={pagination.page}
            getItemProps={getItemProps}
            getControlProps={getControlProps}
        />
    );
};

export {NextPagination};