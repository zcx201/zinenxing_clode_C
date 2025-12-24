import { expect } from 'vitest'
// 使用 jest-dom 的 matchers 并以编程方式扩展 vitest 的 expect
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)
