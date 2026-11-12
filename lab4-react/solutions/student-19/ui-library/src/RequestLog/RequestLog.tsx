import React from 'react'

import { formatRequestTime } from './formatRequestTime'
import styles from './RequestLog.module.css'

export type LLMRequestStatus = 'success' | 'error' | 'pending'

export interface LLMRequest {
  id: string;
  provider: string;
  model: string;
  status: LLMRequestStatus;
  createdAt: string;
  tokens: number;
}

export interface RequestLogProps {
  requests: LLMRequest[];
  rotationRules: string[];
}

const STATUS_LABELS: Record<LLMRequestStatus, string> = {
  success: 'Успех',
  error: 'Ошибка',
  pending: 'В ожидании',
}

export const RequestLog: React.FC<RequestLogProps> = ({ requests, rotationRules }) => {
  return (
    <section className={styles.log} aria-labelledby="request-log-title">
      <h2 className={styles.title} id="request-log-title">
        Журнал запросов
      </h2>

      <div className={styles.rules}>
        <h3 className={styles.rulesTitle}>Правила ротации</h3>
        {rotationRules.length === 0 ? (
          <p className={styles.emptyRules}>Правила не заданы</p>
        ) : (
          <ul className={styles.rulesList}>
            {rotationRules.map(rule => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colProvider} />
            <col className={styles.colModel} />
            <col className={styles.colStatus} />
            <col className={styles.colTime} />
            <col className={styles.colTokens} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Провайдер</th>
              <th scope="col">Модель</th>
              <th scope="col">Статус</th>
              <th scope="col">Время (UTC)</th>
              <th scope="col">Токены</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td className={styles.empty} colSpan={5}>
                  Пусто
                </td>
              </tr>
            ) : (
              requests.map(request => (
                <tr key={request.id}>
                  <td>{request.provider}</td>
                  <td>{request.model}</td>
                  <td>
                    <span className={`${styles.status} ${styles[request.status]}`}>
                      {STATUS_LABELS[request.status]}
                    </span>
                  </td>
                  <td className={styles.time}>{formatRequestTime(request.createdAt)}</td>
                  <td className={styles.tokens}>{request.tokens}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
