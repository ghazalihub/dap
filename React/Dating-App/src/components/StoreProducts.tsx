import {
  Box, Typography, Button,
  Card, CardContent, Divider
} from '@mui/material';
import { ShoppingBag, Verified } from '@mui/icons-material';

interface StoreProductProps {
  onPurchase: (id: string) => void;
}

export const StoreProducts = ({ onPurchase }: StoreProductProps) => {
  const products = [
    { id: 'sub_1m', name: 'Standard Scholar', period: '1 Month', price: '$14.99', save: '' },
    { id: 'sub_6m', name: 'Research Lead', period: '6 Months', price: '$59.99', save: 'Save 30%', featured: true },
    { id: 'sub_12m', name: 'Master Fellow', period: '12 Months', price: '$89.99', save: 'Save 50%' },
  ];

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <Card
          key={p.id}
          onClick={() => onPurchase(p.id)}
          className={`cursor-pointer rounded-2xl transition-all border-2 ${p.featured ? 'border-primary bg-primary/5' : 'border-gray-100'}`}
        >
          <CardContent className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
               <div className={`p-2 rounded-xl ${p.featured ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <ShoppingBag fontSize="small" />
               </div>
               <div>
                  <Typography variant="subtitle2" className="font-bold">{p.name}</Typography>
                  <Typography variant="caption" className="text-gray-500">{p.period}</Typography>
               </div>
            </div>
            <div className="text-right">
               <Typography variant="subtitle1" className="font-black text-primary">{p.price}</Typography>
               {p.save && <Typography variant="caption" className="text-green-600 font-bold">{p.save}</Typography>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
