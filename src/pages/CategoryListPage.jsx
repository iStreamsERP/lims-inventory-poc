import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelFromQueryService } from "@/services/dataModelService";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const CategoryListPage = () => {
	const { userData } = useAuth();
	const { toast } = useToast();
	const [categories, setCategories] = useState([]);
	const [categoryCountMap, setCategoryCountMap] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				await Promise.all([fetchCategories(), fetchCategoryCounts()]);
			} catch (error) {
				toast({
					variant: "destructive",
					title: "Error fetching data",
					description: error?.message || "Unknown error",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const fetchCategories = async () => {
		const payload = {
			SQLQuery:
				"SELECT DISTINCT GROUP_LEVEL1 FROM INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' ORDER BY GROUP_LEVEL1",
		};

		const response = await getDataModelFromQueryService(
			payload,
			userData.currentUserLogin,
			userData.clientURL
		);

		setCategories(response);
	};

	const fetchCategoryCounts = async () => {
		const payload = {
			SQLQuery:
				"SELECT GROUP_LEVEL1, COUNT(ITEM_CODE) AS NO_OF_PRODUCTS FROM INVT_MATERIAL_MASTER WHERE COST_CODE = 'MXXXX' GROUP BY GROUP_LEVEL1",
		};

		const response = await getDataModelFromQueryService(
			payload,
			userData.currentUserLogin,
			userData.clientURL
		);

		const mappedCounts = {};
		response.forEach((item) => {
			mappedCounts[item.GROUP_LEVEL1] = item.NO_OF_PRODUCTS;
		});
		setCategoryCountMap(mappedCounts);
	};

	return loading ? (
		<BarLoader color="#36d399" height={2} width="100%" />
	) : (
		<div className="flex flex-col gap-y-4">
			<h1 className="title">All Categories</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{categories.map((category, index) => (
					<div
						key={index}
						className="relative overflow-hidden h-48 w-full rounded-lg shadow-md group"
					>
						<Link to={`/category-list/${category.GROUP_LEVEL1}`}>
							<div className="w-full h-full cursor-pointer relative bg-slate-700 flex items-center justify-center">
								{category.imageUrl ? (
									<img
										src={category.imageUrl}
										alt={category.GROUP_LEVEL1}
										loading="lazy"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src = "";
											e.target.style.backgroundColor = "red";
											e.target.style.display = "none";
										}}
										className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
									/>
								) : (
									<span className="text-sm text-white">No Image</span>
								)}

								<div className="absolute bottom-0 left-0 right-0 px-4 py-2 z-20 bg-gray-900/50 backdrop-blur-sm">
									<h3 className="text-white text-2xl font-bold">
										{category.GROUP_LEVEL1}
									</h3>
									<p className="text-gray-100 text-sm">
										Explore {category.GROUP_LEVEL1}
									</p>
								</div>

								<Badge variant="secondary" className="absolute top-2 right-2 z-20 h-fit">
									{categoryCountMap[category.GROUP_LEVEL1] || 0} Products
								</Badge>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default CategoryListPage;
