export interface ConfirmationItemsProps {
  orderNumber: string
  orderDate: string
}
export const ConfirmationItems = ({
  orderNumber,
  orderDate,
}: ConfirmationItemsProps) => {
  return (
    <div className="space-y-4">
      {[
        { label: 'Order Number:', value: orderNumber },
        { label: 'Order Date:', value: orderDate },
        {
          label: 'Payment Status:',
          value: 'Paid',
          valueClassName: 'text-green-600 font-medium',
        },
        {
          label: 'Estimated Delivery:',
          value: '3-5 business days',
          noBorder: true,
        },
      ].map(({ label, value, valueClassName, noBorder }) => (
        <div
          key={label}
          className={`flex justify-between ${!noBorder ? 'border-b pb-2' : ''}`}
        >
          <span className="font-medium">{label}</span>
          <span className={valueClassName}>{value}</span>
        </div>
      ))}
    </div>
  )
}
