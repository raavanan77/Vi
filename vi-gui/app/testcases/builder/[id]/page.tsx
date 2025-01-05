"use client"

import { useParams } from 'next/navigation'
import TestCaseBuilder from '@/app/testcases/builder/testcasebuilder'  // adjust path as needed

export default function EditTestCase() {
  const params = useParams()
  return <TestCaseBuilder param={params.id as string} />
}