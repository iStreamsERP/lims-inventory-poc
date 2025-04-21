import { CircleCheck } from "lucide-react";
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { getDataModelService } from '@/services/dataModelService';
import { BarLoader } from 'react-spinners';

const ServicePricingPage = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userData } = useAuth();

  useEffect(() => {
    fetchAllServicesData();
  }, []);

  const fetchAllServicesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        DataModelName: "INVT_MATERIAL_MASTER",
        WhereCondition: "COST_CODE = 'MXXXX' AND ITEM_GROUP = 'SERVICE'",
        Orderby: ""
      };
      const response = await getDataModelService(payload, userData.currentUserLogin, userData.clientURL);

      const updatedResponse = response.map(item => {
        return {
          ...item,
          FEATURES: item.FEATURES ? item.FEATURES.split(",") : [],
        };
      });

      setServiceData(updatedResponse);
    } catch (error) {
      setError(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto w-full px-4'>
      <div className='w-full flex justify-center mt-4'>
        <h1 className='text-5xl text-center font-medium text-white-400 w-full'>
          Simple and Affordable <br /> Pricing Plans
        </h1>
      </div>
      {
        loading ? (
          <BarLoader color="#36d399" height={2} width="100%" className='mt-12' />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
            {serviceData.map((item, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle className=" mb-3 text-sm text-gray-400 ">
                    <div>{item.ITEM_NAME}</div>
                    <Badge className="mt-2">{item.GROUP_LEVEL1}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="mb-4 text-4xl font-semibold">
                    ₹{item.SALE_RATE}<span className='text-sm text-gray-400'>/{item.SALE_UOM || "null"}</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Great for trying out Finament and for small teams
                  </div>
                  <div>
                    <Button className="w-full bg-gradient-to-tr from-violet-600 via-violet-600 to-indigo-600">
                      Start For Free
                    </Button>
                  </div>

                  <div className='text-sm font-normal text-muted-foreground space-y-1'>
                    <div className="text-sm pt-2 mb-2">
                      Features
                    </div>
                    {
                      item.FEATURES.length > 0 ? (
                        item.FEATURES.map((feature, index) => (
                          <p key={index} className='flex items-center gap-1'>
                            <CircleCheck size={18} className="text-violet-500" />
                            {feature}
                          </p>
                        ))
                      ) : (
                        <p className='flex items-center gap-1'>
                          No Features Available
                        </p>
                      )
                    }
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      }

    </div>
  );
};

export default ServicePricingPage;
