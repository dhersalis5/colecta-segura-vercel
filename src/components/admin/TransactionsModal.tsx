import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Project, Transaction } from '@/types/project';

interface TransactionsModalProps {
  project: Project;
  transactions: Transaction[];
  onUpdateStatus: (transactionId: string, status: Transaction['status']) => Promise<void>;
  onClose: () => void;
}

const TransactionsModal: React.FC<TransactionsModalProps> = ({
  project,
  transactions,
  onUpdateStatus,
  onClose
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Transacciones - {project.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Donante
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-slate-500">
                      No hay transacciones pendientes
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50">
                      <td className="p-3 whitespace-nowrap">
                        {transaction.createdAt.toLocaleDateString()}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {transaction.donorName || 'Anónimo'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {transaction.type === 'cash' ? 'Efectivo' : 'Transferencia'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        ${transaction.amount.toLocaleString()}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'pending' ? 'Pendiente' :
                           transaction.status === 'approved' ? 'Aprobada' :
                           'Rechazada'}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {transaction.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-500 hover:text-green-700 hover:bg-green-50"
                              onClick={() => onUpdateStatus(transaction.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Aprobar</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onUpdateStatus(transaction.id, 'rejected')}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Rechazar</span>
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionsModal; 