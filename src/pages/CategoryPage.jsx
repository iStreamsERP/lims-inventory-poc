import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelFromQueryService } from "@/services/dataModelService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";


const CategoryPage = () => {
	const { userData } = useAuth();
	const { toast } = useToast();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCategories();
	}, [])

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const categoriesPayload = {
				SQLQuery: "SELECT DISTINCT GROUP_LEVEL1 FROM INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' ORDER BY GROUP_LEVEL1"
			}

			const categoriesResponse = await getDataModelFromQueryService(categoriesPayload, userData.currentUserLogin, userData.clientURL);

			const updatedCategories = categoriesResponse.map((category) => ({
				...category,
				imageUrl: "https://m.media-amazon.com/images/I/91E69wClQ4L._AC_UY1100_.jpg"
			}))
			setCategories(updatedCategories);
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error fetching categories', error,
			})
		} finally {
			setLoading(false);
		}
	};

	console.log(categories);


	return loading ? <BarLoader color="#36d399" height={2} width="100%" /> : (
		<div className="flex flex-col gap-y-4">
			<h1 className="title">All Categories</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{categories.map((category, index) => (
					<div
						key={index}
						className="relative overflow-hidden h-48 w-full rounded-lg shadow-md group"
					>
						<Link to={`/ category/${category.GROUP_LEVEL1}`}>
							<div className="w-full h-full cursor-pointer relative">
								<img
									src={category.imageUrl}
									alt={category.GROUP_LEVEL1}
									loading="lazy"
									className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
								/>
								<div className="absolute bottom-0 left-0 right-0 px-4 py-2 z-20 bg-gray-900/50 backdrop-blur-sm">
									<h3 className="text-white text-2xl font-bold">{category.GROUP_LEVEL1}</h3>
									<p className="text-gray-100 text-sm">Explore {category.GROUP_LEVEL1}</p>
								</div>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default CategoryPage;
