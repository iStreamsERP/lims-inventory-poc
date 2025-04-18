import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getDataModelFromQueryService } from "@/services/dataModelService";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";

const CategoryListPage = () => {
	const { userData } = useAuth();
	const { toast } = useToast();
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAll = async () => {
			setLoading(true);
			try {
				const payload = {
					SQLQuery:
						"SELECT GROUP_LEVEL1, COUNT(ITEM_CODE) AS productCount, MIN(ITEM_CODE) AS firstItemCode FROM INVT_MATERIAL_MASTER WHERE GROUP_LEVEL1 IS NOT NULL AND GROUP_LEVEL1 &lt;&gt; '' AND COST_CODE = 'MXXXX' GROUP BY GROUP_LEVEL1 ORDER BY GROUP_LEVEL1",
				};

				const data = await getDataModelFromQueryService(
					payload,
					userData.currentUserLogin,
					userData.clientURL
				);

				setCategories(data);

				// Fetch images for each category
				data.forEach((category) => {
					fetchProductImage(category.firstItemCode, category.GROUP_LEVEL1);
				});
			} catch (err) {
				toast({
					variant: "destructive",
					title: "Error fetching categories",
					description: err?.message || "Unknown error",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchAll();
	}, [userData, toast]);

	const fetchProductImage = async (id, groupLevel) => {
		try {
			const response = await axios.get(
				`https://cloud.istreams-erp.com:4499/api/MaterialImage/view?email=${encodeURIComponent(
					userData.currentUserLogin
				)}&fileName=PRODUCT_IMAGE_${id}`,
				{ responseType: "blob" }
			);

			const blob = response.data;

			const mimeType = blob.type;
			const extension = mimeType.split("/")[1] || "png";
			const filename = `PRODUCT_IMAGE_${id}.${extension}`;
			const file = new File([blob], filename, { type: mimeType });

			const imageUrl = URL.createObjectURL(file);

			setCategories((prevCategories) =>
				prevCategories.map((cat) =>
					cat.GROUP_LEVEL1 === groupLevel
						? { ...cat, imageUrl }
						: cat
				)
			);
		} catch (error) {
			toast({
				variant: "destructive",
				title: `Error fetching product image for ${groupLevel}`,
				description: error?.message || "Unknown error",
			});
		}
	};

	return loading ? (
		<BarLoader color="#36d399" height={2} width="100%" />
	) : (
		<div className="flex flex-col gap-y-4">
			<h1 className="title">All Categories</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				{categories.map((category, index) => (
					<div key={index} className="group overflow-hidden">
						<div
							className="h-36 w-full rounded-lg bg-neutral-300 dark:bg-gray-800 overflow-hidden"
						>
							<Link to={`/product-card-list/${category.GROUP_LEVEL1}`} className="relative">
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
										className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
									/>
								) : (
									<span className="text-sm text-white">No Image</span>
								)}
								<Badge className="absolute top-2 right-2 z-20 h-fit">
									{category.productCount || 0} Products
								</Badge>
							</Link>
						</div>
						<h3 className="text-lg font-semibold truncate leading-snug group-hover:text-blue-700">
							{category.GROUP_LEVEL1}
						</h3>
					</div>
				))}
			</div>
		</div>
	);
};

export default CategoryListPage;
