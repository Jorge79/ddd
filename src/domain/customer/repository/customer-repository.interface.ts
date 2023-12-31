import Customer from "../handler/customer";
import RepositoryInterface from "../../@shared/repository/repository-interface";

export default interface CustomerRepositoryInterface extends RepositoryInterface<Customer> { }