// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import oryConfig from "@/ory.config";
import { createOryMiddleware } from "@ory/nextjs/middleware";

export const middleware = async () => createOryMiddleware(oryConfig)

export const config = {}